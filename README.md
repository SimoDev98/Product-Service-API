# Product Service API

## Description
This project is an API that simplifies the managing tasks of product data in back-end or server-side projects such as e-commerces, marketplaces, Inventory managment system etc. Adapting the API to your product data or system requirements is a simple task because the architecture of the API performs four independent layers which are model, repository, controller and server. The data transfer is done over HTTP protocol in JSON format.

## Stack of technologies and dependencies.
The current version is powered by the following technologies:
  * **Node.js** as the runtime enviroment.
  * **MongoDB Cluster** No-SQL database for persistence layer.
  * **AWS S3** service for files storage.
  * **Express.js** server framework.
  * **SSL/TLS** security protocol using X509 certificates for server security.
  * [**Zod**](https://github.com/colinhacks/zod) library for model definition.

## Model
Data model is defined in model layer in code. And database does not have defined constraints or any structure. The intended purpose of this, is to make the code flexible simplifying the adapting processes and updates. For example: If you want to add new fields to your product or remove fields of the main version you don't need to make any changes in the database config or in the repository layer. You just have to modify the model layer according to the requirements of your project.

## Server Security
Server works over HTTPS protocol using SSL/TLS Two-way authentication (server<->client) through X509 Certificates. So both server and client must provide their certificates in the initial TLS handshake process to authenticate each other.
### Security configuration
There are three X509 certificates involved. `CA Certificate`, `Server Certificate` and `Client Certificate`.
  1. Admin owns the `CA Certificate` and its private key. ***IMPORTANT***: Only the administrator owns private key of `CA Certificate`.
  2. Admin signs the `Server Certificate` with the `CA Certificate`.
  3. In the server side, specifically in the path `/src/server/certificate` must be stored the `Server Certificate` and a copy of `CA Certificate`.
  4. Server will only trust client certificates signed by `CA Certificate`.
  5. Admin signs the `Client Certificate` with `CA Certificate` for the client.
  6. In the client side must be stored the `Client Certificate` and a copy of `CA Certificate`.
  7. Client will trust certificates signed by `CA Certificate`.


## Configuration
### .env File configuration
Before execution, you have to configure the [.env](.env) file setting the following enviroment variables:
  * `MONGO_CONNECTION_URL`: URL of the MongoDB Cluster. **IMPORTANT** Product-Service-API uses transactions and this capability is only compatible with MongoDB Clusters. If you have a MongoDB Server running on your host and you link it to the application it wont work properly.
  * `MONGO_DB_NAME`: Name of the database.
  * `AUTHORIZED_EXTENSIONS`: List of file extensions that you allow users to store in AWS S3 Bucket.
  * `SERVER_ADDRESS`: Host address of your server where the application will be running.
  * `SERVER_PORT`: Host port of your server where the application will be running.
  * `CA_CERTIFICATE_FILE_NAME`: Name of the X509 certificate file with extension `.pem` of the ***certification authority certificate***.
  * `CERTIFICATE_FILE_NAME`: Name of the X509 certificate file with extension `.pem` of the ***server certificate*** signed by the certification authority certificate.
  * `KEY_FILE_NAME`: Name of the private key file with extension `.pem` of the aplication admin certificate.
  * `AWS_S3_BUCKET_URL`: URL of the AWS S3 Bucket where the product files will be stored.
  * `AWS_S3_BUCKET_ACCESS_ID`: Acces id of the AWS S3 Bucket.
  * `AWS_S3_BUCKET_SECRECT_ACCESS_KEY`: Secret acces key of the AWS S3 Bucket.
  * `AWS_S3_BUCKET_NAME`: Name of the AWS S3 Bucket.
### Database
  1. Create a MongoDB Cluster and register your HOST public ip address in the [MongoDB Website](https://www.mongodb.com/es).
  2. Create a Database in the cluster.
  3. Create two Collections **Product** & **Version**

## Requests
All the requests must have two headers: 'user-rol' which can be client, supplier or admin. And 'user-id' which is the identifier of user.

### GET
**GET PRODUCTS BY ID**
Endpoint: '/product/id'
URL query: '?id='

**GET PRODUCTS BY SEARCH**
Endpoint: 'product/search'
URL query: '?search=something&tags=tag1,tag2'

**GET UNVERIFIED PRODUCTS**
Endpoint: '/product/unverified-products'
Headers: 'user-rol: admin'

**GET PRODUCTS BY USER ID**
Endpoint: '/product/products-by-user-id'
URL Query: '?id='

**GET PRODUCTS OF OWNER BY ID**
Endpoint: '/product/products-of-owner-by-user-id'
URL Query: '?id='
Headers: 'user-rol: admin' or 'user-rol: supplier'

### PATCH
**UPDATE PRICE**
Endpoint: '/version/update-price'
Body: {userID: "", versionID: "", price: (float)}
Headers: 'user-rol: supplier'

**UPDATE UNITS**
Endpoint: '/version/available-price'
Body: {userID: "", versionID: "", availableUnits: (int)}
Headers: 'user-rol: supplier'

**VERIFY PRODUCT**
Endpoint: '/product/verify'
URL Query: '?id='
Headers: 'user-rol: admin'

### DELETE
Endpoint: '/product/delete-by-id'
Body: {productID: ""}
Headers: 'user-rol: admin'

### INSERT
** INSERT PRODUCT **
Endpoint: '/product'
Headers: 'user-rol: admin' or 'user-rol: supplier'
Body:
  files: contain the files with this format name: '***name_of_the_file***'+'version-'+'***number_of_the_version***'+'.***extension***'
  product: JSON with product data. You will find an example in `/examples/insert-produc-format-example.json`
