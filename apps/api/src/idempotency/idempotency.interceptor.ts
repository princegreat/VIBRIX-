import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface Stored {
  fingerprint: string;
  body: unknown;
  expiresAt: number;
}

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly store = new Map<string, Stored>();
  private readonly ttlMs = 24 * 60 * 60 * 1000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();
    const idemKey = req.headers['idempotency-key'];

    if (req.method !== 'POST' || typeof idemKey !== 'string' || !idemKey) {
      return next.handle();
    }

    const now = Date.now();
    for (const [k, v] of this.store) {
      if (v.expiresAt < now) this.store.delete(k);
    }

    const caller = String(req.headers['authorization'] ?? req.headers['x-api-key'] ?? '');
    const owner = createHash('sha256').update(caller).digest('hex');
    const storeKey = `${owner}:${req.method}:${req.path}:${idemKey}`;
    const fingerprint = createHash('sha256')
      .update(JSON.stringify(req.body ?? {}))
      .digest('hex');

    const hit = this.store.get(storeKey);
    if (hit) {
      if (hit.fingerprint !== fingerprint) {
        throw new UnprocessableEntityException(
          'Idempotency-Key was already used with a different request body',
        );
      }
      res.setHeader('Idempotent-Replayed', 'true');
      return of(hit.body);
    }

    return next.handle().pipe(
      tap((body) => {
        this.store.set(storeKey, { fingerprint, body, expiresAt: now + this.ttlMs });
      }),
    );
  }
}
