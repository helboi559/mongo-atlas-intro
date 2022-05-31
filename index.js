//insert new blogPost
const blogPosts = 
    {
      createdAt: "2022-03-22T10:36:37.176Z",
      title: "test",
      text: "this is a test",
      author:'juan r.',
      id: "6"
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
db.posts.deleteOne({id:'6'})

// assignment to get posts
const getPosts = (limit,skip,sortField, sortOrder, filterField, filterValue)=> {
    
  
    
    const sortParams = {}
    sortParams[sortField]=sortOrder
    
    const filterParams = {}
    filterParams[filterField]=filterValue
    
    let dbResult = db.posts.find(filterParams).limit(limit).skip(skip).sort(sortParams).toArray()
    
    return dbResult;
}

// console.log(getPosts(10, 2, 'createdAt', 1))
//----------------------------------------------------------------------------------------
//change the id values to numbers instead of string to existing values via changing field type
db.getCollection("posts").update(
    {
        
        //"id" : { $type: "string" }  //update all of type string
    },
    [{
        $set: {
            "id":
            {
                $convert: {
                    input: "$id",
                    to: "int", //available convert types: string|bool|int|long|double|decimal|date|timestamp|objectId ...
                    //onError:"$id", //remain unchanged
                    //onNull: 0, //if the input is null or missing
                }
            },
        }
    }],
    { multi: true }
)

//return a single blog post 
const findPost = (blogId) => {
    
   return db.posts.findOne({"id":blogId})
   
}
// console.log(findPost(5))
// db.posts.find({'id':5})
//=>{
//   "_id": "628d38a163019e865e5b2793",
//   "createdAt": "2021-11-12T05:53:38.000Z",
//   "title": "quod",
//   "text": "Quam necessitatibus nihil omnis laborum neque est a a voluptates. Occaecati aliquam officiis. Sed adipisci consectetur aut nulla aperiam harum ea voluptates eos. Recusandae harum dicta voluptatem autem voluptate doloremque laudantium qui dolorum. Laudantium cupiditate excepturi fugiat ea nam. Quidem inventore pariatur esse unde laboriosam voluptate et quis fuga.\nEt dolorem culpa sint. Qui sunt dignissimos fuga et eum. Tempora error voluptas aut eum provident.\nAperiam et optio qui nesciunt dolore consequuntur dolor est. Sed eius distinctio doloribus libero atque ullam id. Laborum qui facilis magni voluptatem sed quaerat voluptatum pariatur. Autem ea eum. Sit quisquam quasi modi voluptatum rem dolores vel omnis dolorum. Porro suscipit aut id.",
//   "author": "Sara Hickle",
//   "lastModified": "2022-05-24T08:32:40.447Z",
//   "category": "non",
//   "id": 5
// }

//return a number of total length of the posts collection
const getPostsCollectionLength= () => {
    return db.posts.count()
}
// console.log(getPostsCollectionLength())
// => 50

//create post, add remaining fields (createdAt, lastModified)

const makePost = (blogId,title,text,author,category) => {
    blogId = blogId + 1
    const now = new Date();
    let lastModified = new Date();
    const newPost = db.posts.insertOne({
        'createdAt':now.toISOString(),
        'title':title,
        'text':text,
        'author':author,
        'lastModified':lastModified.toISOString(),
        'category':category,
        'id':blogId
    })
    return newPost
}
const postLength = getPostsCollectionLength()
// console.log(makePost(postLength,'Among us','This is among us all. There is nothing greater.','Juan','qui'))

//update post - update selected post by id - ensure last modified is updated 
const updatePost = (blogId, title, text, author, category) => {
    const updatePost = db.posts.updateOne(
        {'id':blogId},
        {
            $currentDate: {'lastModified':true },
            $set:{'title':title, 'text':text, 'author':author, 'category':category}
        }
        )
    return updatePost
}

// console.log(updatePost(51,'updated1','this is updated', 'john s','auth'))

//delete multiple posts given an array
const deletePosts = (arr) => {
    arr.forEach(ele => {
        return db.posts.deleteOne({"id":ele})
    })
    return;
}
// console.log(deletePosts([50,48,49]))


//go through all docs and generate list of all author names -- stretch goal
    //create a new list in blogs db "users" w/ similar data 

const getList = () => {
    let authors = splitName(db.posts.distinct('author'))
    //get arr of results with field as input via 'distinct' 
    let posts = db.posts.distinct('_id')
    let id = 0
    posts.forEach((ele,index) => {
        const ele2 = authors[index]
        let splitted = ele2.split(' ')
        const first = splitted[0]
        const last = splitted[1]
        const email = `${first}.${last}@gmail.com`
        id = id += 1
        db.users.insertOne({'first':first, "last":last, 'userId':id.toString(), 'email':email, "posts":[ele]})
    })
    return;
}

//helper function to sort list and make names lower case **still not able to filter out "DDS" && "Mr.", playing with REGEX
const splitName = (listNames) => {  
    let newName = []
    for(let j = 0 ; j < listNames.length ; j++) {
        // console.log(words[j])
        let words = listNames[j]
        let newChar = ''
        for(let i = 0 ; i < words.length ; i++) {
            if(words[i]   )
            if(words[i] === words[i].toUpperCase()) {
                newChar += words[i].toLowerCase()
            } else {
                newChar += words[i]
            }
        }
        newName.push(newChar)
    }
    return newName
}

getList()