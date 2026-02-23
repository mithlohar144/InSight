## Backend API Documentation

### Overview

This backend exposes RESTful endpoints for authentication and basic social features (posts, likes, and following).  
All protected routes expect a valid JWT token stored in the `token` cookie.

### Authentication & Authorization

- **Auth mechanism**: JWT signed with `process.env.JWT_SECRET`.
- **Token transport**: HTTP cookie named `token`.
- **Middleware**: `identifyUser` reads and verifies the token and sets `req.user`.
- **Protected routes**: All post, like, follow, and unfollow operations require a valid `token` cookie.

---

## Auth Endpoints

### Register

- **Method**: `POST`  
- **URL**: `/api/auth/register`  
- **Auth required**: **No**

**Request body (JSON)**:

- `username` (string, required)
- `email` (string, required)
- `password` (string, required)
- `bio` (string, optional)
- `profileImage` (string, optional URL)

**Successful response (200)**:

- **Body**:
  - `message`: `"User Regitration Successfully"`
  - `user`:
    - `username`
    - `email`
    - `bio`
    - `profileImage`
- A `token` cookie is set containing the JWT for the new user.

**Error responses**:

- `409 Conflict` – user with same `username` or `email` already exists.

---

### Login

- **Method**: `POST`  
- **URL**: `/api/auth/login`  
- **Auth required**: **No**

**Request body (JSON)**:

- `username` (string) **or** `email` (string) – at least one is required
- `password` (string, required)

**Successful response (200)**:

- **Body**:
  - `message`: `"User Login Success"`
  - `user`:
    - `username`
    - `email`
    - `bio`
    - `profileImage`
- A `token` cookie is set containing the JWT for the logged‑in user.

**Error responses**:

- `404 Not Found` – user not found by given `username`/`email`.
- `401 Unauthorized` – invalid password.

---

## Post Endpoints

### Create Post

- **Method**: `POST`  
- **URL**: `/api/posts/`  
- **Auth required**: **Yes** (JWT in `token` cookie)
- **Middleware**:
  - `multer` single file upload on field `image`
  - `identifyUser` (JWT auth)

**Request**:

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `image` (file, required) – image to upload.
  - `caption` (string, optional) – text caption for the post.

**Successful response (200)**:

- **Body**:
  - `message`: `"Post Create SuccessFully ,"`
  - `post`: newly created post document, including:
    - `caption`
    - `ImageUrl`
    - `user` (MongoDB ObjectId of creator)

**Error responses**:

- `401 Unauthorized` – missing/invalid `token` cookie.
- `4xx/5xx` – upload or validation errors (e.g. missing image or invalid configuration).

---

### Post Details

- **Method**: `GET`  
- **URL**: `/api/posts/details/:postId`  
- **Auth required**: **Yes** (JWT in `token` cookie)

**Path params**:

- `postId` (string, required) – MongoDB ObjectId of the post.

**Behavior**:

- Fetches the post by `postId`.
- Only allows access if the logged‑in user is the owner of the post.

**Successful response (200)**:

- **Body**:
  - `message`: `"Post Details Fatch SuccessFully"`
  - `post`: full post document.

**Error responses**:

- `404 Not Found` – post does not exist.
- `403 Forbidden` – logged‑in user is not the owner of the post.
- `401 Unauthorized` – missing/invalid `token` cookie.

---

### Like Post

- **Method**: `POST`  
- **URL**: `/api/posts/like/:postId`  
- **Auth required**: **Yes** (JWT in `token` cookie)

**Path params**:

- `postId` (string, required) – MongoDB ObjectId of the post to like.

**Behavior**:

- Validates that the post exists.
- Creates a like record linking the current user and the post.

**Successful response (200)**:

- **Body**:
  - `message`: `"Post Like SuccessFully "`
  - `like`: created like document, including:
    - `post` (ObjectId)
    - `user` (username)

**Error responses**:

- `404 Not Found` – post does not exist.
- `401 Unauthorized` – missing/invalid `token` cookie.

---

## Follow Endpoints

### Follow User

- **Method**: `POST`  
- **URL**: `/api/users/follow/:username`  
- **Auth required**: **Yes** (JWT in `token` cookie)

**Path params**:

- `username` (string, required) – username of the user to follow.

**Behavior**:

- Prevents following yourself.
- Validates that the target user exists.
- If already following, returns the existing follow record.
- Otherwise, creates a new follow record.

**Successful responses**:

- `201 Created` – newly created follow:
  - `message`: `"You are now following :username"`
  - `follow`: created follow document.
- `200 OK` – already following:
  - `message`: `"You are already following :username"`
  - `follow`: existing follow document.

**Error responses**:

- `400 Bad Request` – trying to follow yourself.
- `404 Not Found` – target user does not exist.
- `401 Unauthorized` – missing/invalid `token` cookie.

---

### Unfollow User

- **Method**: `POST`  
- **URL**: `/api/users/unfollow/:username`  
- **Auth required**: **Yes** (JWT in `token` cookie)

**Path params**:

- `username` (string, required) – username of the user to unfollow.

**Behavior**:

- Checks if a follow record between the current user and `username` exists.
- If not following, returns a message indicating that.
- If following, deletes the follow record.

**Successful responses (200)**:

- If not following:
  - `message`: `"you are not following :username"`
- If unfollowed:
  - `message`: `"You have unfollowed :username"`
  - `isUserFollowing`: the deleted follow document.

**Error responses**:

- `401 Unauthorized` – missing/invalid `token` cookie.
