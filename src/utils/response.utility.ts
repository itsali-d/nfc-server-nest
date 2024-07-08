import { HttpCode, HttpStatus, HttpException } from '@nestjs/common';
export class Response {
  statusCode: HttpStatus;
  message;
  payload: any;
  constructor(code: HttpStatus, message: string, payload: any) {
    this.statusCode = code;
    this.message = message;
    this.payload = payload;
  }
  error() {
    console.log(this.payload);
    if (this.payload.name == 'CastError') {
      console.log('in if');
      let newMessage = `Invalid id for associated ${this.payload.message.slice(
        this.payload.message.lastIndexOf('model'),
      )}`;
      throw new HttpException(
        {
          statusCode: this.statusCode,
          error: this.payload,
          message: newMessage,
        },
        this.statusCode,
      );
    }
    throw new HttpException(
      {
        statusCode: this.statusCode,
        error: this.payload,
        message: this.message,
      },
      this.statusCode,
    );
  }
}
