import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { ExampleService } from '../../app-services/example.service';

@Service()
@JsonController('/example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  async exampleQuery(): Promise<{
    msg: string;
    awesome: boolean;
    async: boolean;
  }> {
    return new Promise((resolve) => {
      resolve({
        msg: this.exampleService.getMessage(),
        awesome: true,
        async: true,
      });
    });
  }
}
