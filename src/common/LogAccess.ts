import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Service } from 'typedi';

@Service()
export class LogAccess implements MiddlewareInterface<any> {
  constructor() {
    console.log('LogAccess Constructor');
  }

  async use({ context, info }: ResolverData<any>, next: NextFn) {
    console.log('LogAccess %o', { context, info });
    /* const username: string = context.username || 'guest';
    this.logger.log(`Logging access: ${username} -> ${info.parentType.name}.${info.fieldName}`); */
    return next();
  }
}
