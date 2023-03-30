import { Offer } from './offers/entities/offers.entity';
import { User } from './users/entities/users.entity';
import { Wish } from './wishes/entities/wishes.entity';
import { WishList } from './wishlists/entities/wishList.entity';

/* ФАЙЛ КОНФИГУРАЦИИ ДЛЯ ПОДКЛЮЧЕНИЯ ПРИЛОЖЕНИЯ К БД (данные берутся из файла .env) */
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Offer, Wish, WishList],
    synchronize: true,
  },
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtLiveTime: process.env.JWT_LIVE_TIME,
});
