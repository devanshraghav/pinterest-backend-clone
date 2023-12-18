1. / route page par login and signup page hoga
2. /profile par hum apni profile dekh paaenge and saved post dikhenge,
    aur ek upload section bhi hoga.
3. /feed yaha par saari images dikhegi
4. /clicked click karke image open ho jaaegi
5. /board/:boardname espe poora board dikhega.


// create user

router.get("/create", async function (req, res, next) {
  const user = await userModel.create({
    username: "luv",
    password: "anything",
    post: [],
    dp: "dp",
    email: "luv@luv.com",
    fullName: "luv is luv",
  });
  res.send(user);
});

// create post

router.get("/createpost", async function (req, res, next) {
  const postCreated = await postModel.create({
    postText: "This is the second post",
    user: "657010bdcd7aa6f83a7962dc",
  });

  // find user id who created this post - for now using id.
  let user = await userModel.findOne({ _id: "657010bdcd7aa6f83a7962dc" });

  //  then put the post id in the users id

  // console.log(user.post);
  user.post.push(postCreated._id);

  // then save data for user.
  await user.save();

  res.send(postCreated);
});

router.get("/alluserpost", async function (req, res, next) {
  // if we send a repons of this user then we will see that in place of post there is post id.
  // but we want to see actual post.
  // So, for that after we find the user then : we will use populate() method and specify which field we want to populate.
  // here its post field therefore :

  let user = await userModel
    .findOne({ _id: "657010bdcd7aa6f83a7962dc" })
    .populate("post");

  res.send(user);
});


<!-- Profile Page -->
Post: will have  Image, Caption
