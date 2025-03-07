# Product Inventory API

A RESTful API for managing product inventory built with Node.js, Express, and MongoDB. This API provides endpoints for creating, reading, updating, and deleting products with features like pagination, filtering, and sorting.

## Features

- CRUD operations for products
- MongoDB database integration
- Pagination support
- Filtering by category, price range, and stock
- Sorting capabilities
- Error handling
- CORS enabled
- Environment variable configuration
- Serverless deployment ready (Vercel)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd product-inventory-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Products

#### Get All Products

- **URL**: `/api/products`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of items per page (default: 10)
  - `category` (optional): Filter by category
  - `minPrice` (optional): Filter by minimum price
  - `maxPrice` (optional): Filter by maximum price
  - `name` (optional): Search by product name
  - `stock` (optional): Filter by minimum stock
  - `sort` (optional): Sort by field (prefix with - for descending order)

#### Get Single Product

- **URL**: `/api/products/:id`
- **Method**: `GET`

#### Create Product

- **URL**: `/api/products`
- **Method**: `POST`
- **Body**:

```json
{
  "name": "Product Name",
  "price": 99.99,
  "category": "Category Name",
  "stock": 100,
  "description": "Product description"
}
```

#### Update Product

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Body**: Same as Create Product (all fields optional)

#### Delete Product

- **URL**: `/api/products/:id`
- **Method**: `DELETE`

## Example Usage

### Get All Products with Pagination and Filtering

```bash
curl "http://localhost:3000/api/products?page=1&limit=10&category=Electronics&minPrice=100&maxPrice=1000&sort=-price"
```

### Create a New Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "description": "Latest model smartphone"
  }'
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy

### Environment Variables

Required environment variables for deployment:

- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Set to "production" for deployment

## Project Structure

```
product-inventory-api/
├── app.js              # Main application file
├── routes/             # Route definitions
│   └── productRoutes.js
├── models/             # Database models
│   └── Product.js
├── .env               # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
