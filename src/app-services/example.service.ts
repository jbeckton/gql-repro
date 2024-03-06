import { Service } from 'typedi';

@Service()
export class ExampleService {
  constructor() {}

  getMessage(): string {
    return 'This is a message for you!';
  }
}
