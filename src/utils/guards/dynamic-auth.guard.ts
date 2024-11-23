import { ExecutionContext, Type, mixin } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function DynamicAuthGuard(strategies: string[]): Type<any> {
  class MixinAuthGuard extends AuthGuard(strategies) {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      console.log(strategies);

      const canActivate = (await super.canActivate(context)) as boolean;
      return canActivate;
    }
  }

  const guard = mixin(MixinAuthGuard);
  return guard;
}
