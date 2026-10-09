import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './Users/users.entity';
import { Token } from './Token/token.entity';
import { UsersModule } from './Users/users.module';
import { TokenModule } from './Token/token.module';
// import { CloudinaryModule } from './Cloudinary/cloudinary.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
// import { MailModule } from './mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { MessageModule } from './Messages/messages.module';
import { FaqModule } from './Faq/faq.module';
import { ServicesModule } from './Services/services.module';
import { ConversationModule } from './Conversations/conversations.module';
import { CategorysModule } from './Category/category.module';
import { AiModule } from './AI/ai.module';
import { Conversation } from './Conversations/conversations.entity';
import { Message } from './Messages/messages.entity';
import { Faq } from './Faq/faq.entity';
import { Service } from './Services/services.entity';
import { Category } from './Category/category.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          ttl: 3600,
        }),

      }), 
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DB_USERNAME, 
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      synchronize: true, 
      logging: false,  
      entities: [
        Token,   
        User,
        Conversation,
        Message,
        Faq,
        Service,
        Category, 
      ],   
    }),
    PassportModule.register({session:true}),
    TokenModule,
    UsersModule,
    FaqModule,
    ServicesModule,
    ConversationModule,
    CategorysModule,
    MessageModule,
    AiModule,
    
  ],
})
export class AppModule { }