import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController()
export class defaultController {
  constructor() {}

  @Get()
  async get(): Promise<{
    msg: string;
  }> {
    return new Promise((resolve) => {
      resolve({
        msg: 'This is the Default Controller',
      });
    });
  }
}
