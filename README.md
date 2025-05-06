# 🏠 StayDwell - Airbnb Clone

## 📋 Overview
StayDwell is a full-stack Airbnb clone application that allows users to browse, book, and host properties. The application features user authentication, property listing management, booking functionality, and favorites list.

## 🛠️ Tech Stack
- **Frontend**: EJS, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM

## ✨ Features

### 👤 User Features
- User registration and authentication
- Browse available properties on the home page
- View detailed information about properties
- Mark properties as favorites
- Access personalized favorites list
- Book properties with date selection
- View booking history and status

### 🏘️ Host Features
- Host registration and authentication
- Add new properties to the platform
- Manage existing property listings
- View booking requests for their properties
- Track property performance and availability

## 🚀 Installation and Setup

### 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### 📥 Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/staydwell.git
   cd staydwell
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/staydwell
   SESSION_SECRET=yoursecretkey
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## 💾 Database Structure

### User Schema
- username
- email
- password (hashed)
- role (user/host)
- favorites (array of property IDs)
- bookings (array of booking IDs)

### Property Schema
- title
- description
- location
- price
- images
- amenities
- host (reference to User)
- availability (dates)


### Booking Schema
- property (reference to Property)
- user (reference to User)
- checkIn (date)
- checkOut (date)
- totalPrice
- status (pending/confirmed/cancelled)

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user

### Properties
- `GET /properties` - Get all properties
- `GET /properties/:id` - Get specific property
- `POST /properties` (host only) - Add new property
- `PUT /properties/:id` (host only) - Update property
- `DELETE /properties/:id` (host only) - Delete property

### Bookings
- `POST /bookings` - Create a new booking
- `GET /bookings` - Get all bookings for current user
- `GET /bookings/:id` - Get specific booking
- `PUT /bookings/:id` - Update booking status

### Favorites
- `POST /favorites/:propertyId` - Add property to favorites
- `DELETE /favorites/:propertyId` - Remove property from favorites
- `GET /favorites` - Get all favorite properties

## 👥 User Roles and Permissions

### Regular User
- Can browse properties
- Can book properties
- Can manage their own bookings
- Can add/remove properties to/from favorites
- Can view their favorite properties


### Host User
- Has all regular user permissions
- Can add new properties
- Can manage their own properties
- Can view booking requests for their properties
- Can approve/reject booking requests

## 🚀 Future Enhancements
- Implement payment processing
- Add messaging system between hosts and guests
- Add review and rating system
- Add map view for property locations
- Implement search filters (price range, amenities, etc.)
- Add admin dashboard for platform management

## 🙏 Acknowledgements
- This project is created for educational purposes
- Inspired by Airbnb's functionality and design
