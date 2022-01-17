 Gateway Test Project
-
> Get Started

### Installation
1. Clone repo from command line `git clone https://github.com/pullr3qu35t/gateway-test.git` or just download the entire project
from [here](https://github.com/pullr3qu35t/gateway-test/archive/refs/heads/main.zip)
2. Open folder *gateway-test* and run `npm i` 
3. Run `cd front/ && npm i` to intall frontend packages dependencies

### Populate MongoDB Collection
- Run this command`npm run seed` or `yarn seed`

### Running Functional Tests for the API
 - Run `npm run test` or `yarn test`<br>

*(Before running the tests, the collection will be cleaned and populate it again)*

### Start serving in dev mode
- Run `npm run start:all` or `yarn start:all`

### Start serving in production mode
- Run `npm run build` or `yarn build`
  
### Environment Variables
- You can provide your own connection string for mongodb server with this command `MONGODB_CONNECTION="mongodb://<server>:<port>/<database>" npm run start:all`<br> *(Ex: `MONGODB_CONNECTION="mongodb://localhost:27017/musala" npm run start:all`)*

- By default It's expecting that your Database name would be: **node-test-project** and your collection: **gateways**
 
- You can provide your MongoDB collection name with this: `MONGODB_COLLECTION="<collection_name>" npm run start:all`<br>

- If you want to increase or reduce the maximum of devices per gateway validation, just run `MAX_DEVICES_PER_GATEWAY=<devices_max> <npm_script>` *(Ex: `MAX_DEVICES_PER_GATEWAY=3 npm run start:all`)*

 - *You can use at the same command multiples env vars like MONGODB_CONNECTION, NODE_ENV, MONGODB_COLLECTION, MAX_DEVICES_PER_GATEWAY (Ex: VAR_1="valor" VAR_2="valor" <npm_script>)*
