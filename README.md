# Mongo-atlas-intro

## Requirements - DB setup & playground download to test functions

### Mongo Atlas Setup

- [Mongo Link](https://www.mongodb.com/cloud/atlas/register?utm_content=rlsapostreg&utm_source=google&utm_campaign=gs_americas_uscan_search_brand_dsa_atlas_desktop_rlsa_postreg&utm_term=&utm_medium=cpc_paid_search&utm_ad=&utm_ad_campaign_id=14383025495&adgroup=129270225274&gclid=Cj0KCQjw4uaUBhC8ARIsANUuDjX_tyFL5XI2jggM0vdAkEuSov1d1sG2SFrOEzFKHnX73EwwV478LBUaAqCWEALw_wcB)
- Create a Mongo Atlas account, setup security configurations. DB access users, network access.
- Create a Mongo Atlas database cluster with username and password

### Playground for mongo

- Connect to your new cluser via NoSqlBooster [NoSql](https://nosqlbooster.com/downloads)
- Create a new collection blogPosts
- Write a script in NoSqlBooster that does the following: Insert a new blog post, Read the new blog post, Update the new blog post with a new title, Delete the new blog post

- Write a new function getPosts(limit, page, sortField, sortOrder, filterField, filterValue )
- When getPosts is invoked it should
- Return all blog posts if there are no arguments given
- If limit is given, the returned posts length should be equal or less than limit
- If page is given, the returned posts should be the next page of results given a limit
- If sortField and sortOrder are given, the returned posts should be sorted on the field given by sortField and ordered by sortOrder. E.G. sortField="date", sortOrder="asc" should sort the result by date in ascending order.
- If filterParam is given, the result should be filter the result based upon the filterParam field. E.G. if filterParam="category" and the filterValue="dog" the result should only show posts in which the category is dog.

* Continue to build your database functionality by implementing the following functions:
  - [OPTIONAL] Convert all the blog post id's from the string type to the number type. Hint: if you run the following code in noSqlBooster, this will convert the field type from a string to an int32 for all id's in the posts collection. Note: if your posts collection is named differently, you'll have to change the string being passed into db.getCollection() from "posts" to whatever you named your posts collection.
  ```js
  db.getCollection("posts").update(
      {},
      [{
        $set: {"id":{$convert: {input: "$id",to: "int"}},
        }],
        { multi: true }
      )
  ```
  - findPost(blogId) should return a single blog post given an ID.
  - getPostsCollectionLength() should return a number representing the total length of the blog posts collection.
  - makePost(blogId, title, text, author, category) should create a new blog post in mongo. Remember you need to generate and add a createdAt date, and a lastModified date to the post before inserting it into the collection. Additionally, blogId should be calculated by taking the total length of blog posts in the database and adding 1 to it. Hint: use the getPostsCollectionLength() function to quickly determine the current length of the collection.
  - updatePost(blogId, title, text, author, category) should find a post matching the id of blogId and then update the title, text, author and category fields with the inputted information. Remember, since lastModified is a representation of when the post was last updated (including creation), you will have to update lastModified to the current date and time as well.
  - deletePosts(blogIds) should take in an ARRAY of blogId's in the blogIds param. The function should iterate through the array of blogId's and delete all the blog posts with matching id's.
  - Stretch Goal:
    - Iterate through the posts collection and generate a list of author names. Create a new collection in your blogs database called users (this collection should be on the same hierarchical level as the posts collection). For every author in the list do the following:
    - Create and insert a new user object into the users collection with the following fields:
      - firstName
      - lastName
      - userId - a unique id. It can be the same scheme as the posts id, a number representing the current length of the collection + 1
      - email - should be the following format <firstName>.<lastName>@gmail.com, all lowercase letters, with no whitespace in the email address.
      - posts - should be a list of mongo OBJECTID's representing a list of every post that author has made.
      - E.G. if this post exists:
        ```js
        {
        "\_id": new ObjectId("628d233e1505f82ea360a613")
        "createdAt": "2021-06-08T12:25:55.889Z",
        "title": "officia",
        "text": "Lorem Ipsum.",
        "author": "Jacqueline Hudson",
        "lastModified": "2022-05-24T00:55:08.105Z",
        "category": "dolores",
        "id": "2"
        }
        //Then the following user should be generated and inserted into the users collection:
        {
        "firstName": "Jacqueline"
        "lastName": "Hudson"
        "userId": "1"
        "email": "jacqueline.hudson@gmail.com"
        "posts": [new ObjectId("628d233e1505f82ea360a613")]
        }
        ```
      ```

      ```
  - Super Strech Goal: Write a function getUser(email) that will lookup a user in the users collection. The function should also loop through the posts array on the user object and transform the ObjectId's into the corresponding post document before returning it. E.G. running getUser("jacqueline.hudson@gmail.com") should return:
    ```js
    {
    "firstName": "Jacqueline"
    "lastName": "Hudson"
    "userId": "1"
    "email": "jacqueline.hudson@gmail.com"
    "posts": [{
    "_id": new ObjectId("628d233e1505f82ea360a613")
    "createdAt": "2021-06-08T12:25:55.889Z",
    "title": "officia",
    "text": "Lorem Ipsum.",
    "author": "Jacqueline Hudson",
    "lastModified": "2022-05-24T00:55:08.105Z",
    "category": "dolores",
    "id": "2"
    }]
    }
    ```
