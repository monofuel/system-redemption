import { Controller, Get, Route, Request } from 'tsoa';

@Route('tests')
export class MapController extends Controller {
  @Get('')
  public async getMap(): Promise<void> {
    // TODO
  }
}
