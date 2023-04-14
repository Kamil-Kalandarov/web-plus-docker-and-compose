import { Offer } from "./offers/entities/offers.entity";
import { User } from "./users/entities/users.entity";
import { Wish } from "./wishes/entities/wishes.entity";
import { WishList } from "./wishlists/entities/wishList.entity";

/* ФАЙЛ КОНФИГУРАЦИИ ДЛЯ ПОДКЛЮЧЕНИЯ ПРИЛОЖЕНИЯ К БД (данные берутся из файла .env) */
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User, Offer, Wish, WishList],
    synchronize: true,
  },
  jwtSecretKey: process.env.JWT_SECRET,
  jwtLiveTime: process.env.JWT_LIVE_TIME,
});
