//insert new blogPost
const blogPosts = 
    {
      createdAt: "2022-03-22T10:36:37.176Z",
      title: "test",
      text: "this is a test",
      author:'juan r.'
      id: "6",
    }
db.posts.insertOne(blogPosts)

//read blogpost
db.posts.find({id:'6'}).limit(100)

// read all posts
db.posts.find({}).limit(100)

//update post with a new title
db.posts.update({id: '6'}, 
    {$set:{title:'this is a new title'}}, 
)

// delete new post
db.posts.deleteOne({id:'6')