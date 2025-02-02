// import { Injectable, Inject } from '@nestjs/common';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';

// @Injectable()
// export class TestService {
//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

//   async testRedisCache(): Promise<any> {
//     await this.cacheManager.set('testKey', 'Hello Redis!', 600);
//     const value = await this.cacheManager.get('testKey');
//     console.log('Valor en testKey:', value);
//     return value;
//   }
// }
