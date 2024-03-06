import { ResolverData, AuthCheckerInterface, createMethodDecorator, AuthChecker } from 'type-graphql';
import { Service } from 'typedi';
import { MyContext } from '../context.interface';

export function HasAbility(abilities: { action: string; subject: string }[]) {
  return createMethodDecorator(({ args, context, info }: any, next) => {
    console.log('HasAbility ability %o', abilities);
    //console.log('HasAbility context %o', context);

    return next();
  });
}

@Service()
export class MyCustomAuthChecker implements AuthCheckerInterface<MyContext, { action: string; subject: string }> {
  constructor() {}

  check({ root, args, context, info }: ResolverData<MyContext>, abilities: { action: string; subject: string }[]) {
    console.log('MyCustomAuthChecker %o', abilities);

    // console.log('MyCustomAuthChecker context %o', context);

    return true;
  }
}

export const customAuthChecker: AuthChecker<{ action: string; subject: string }> = ({ root, args, context, info }, abilities) => {
  //console.log('customAuthChecker context %o', context);
  console.log('customAuthChecker abilities %o', abilities);
  return true; // or 'false' if access is denied
};
