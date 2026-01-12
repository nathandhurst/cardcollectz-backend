import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',              // dev
      'http://127.0.0.1:5500',             // if you use Live Server
      'https://cardcollectz.netlify.app',  // (we’ll use later for Netlify)
      // add your custom domain later if you get one
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API listening on port ${port}`);
}
bootstrap();
