const books = require("../model/bookModel");
const { checkout } = require("../router");
const stripe = require('stripe')(process.env.stripeSecretKey)

    



exports.addBookController = async (req, res) => {
    console.log("Inside Add book controller ");
    // console.log(req.files);
    const { title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category);



    // const uploadImages=req.files
    // console.log(uploadImages);


    var uploadImages = []
    req.files.map((item) => uploadImages.push(item.filename))
    // console.log(uploadImages);

    const userMail = req.payload // email from jwt
    // console.log(userMail);

    console.log(title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, userMail);


    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json("You have already added the Book")
        } else {
            const newBook = new books({
                title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language, isbn, category, uploadImages, userMail

            })
            await newBook.save()
            res.status(200).json(newBook)
        }

    } catch (error) {
        res.status(500).json(error)

    }
}

// get home books

exports.getHomeBooksController = async (req, res) => {
    console.log("Inside Home Book Controller");

    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)

    } catch (error) {
        res.status(500).json(error)
    }

}


// get all books user-side

exports.getAllBooksController = async (req, res) => {
    console.log("Inside All Book Controller");
    // console.log(req.query.search);
    const searchKey = req.query.search

    const userMail = req.payload

    const query = {
        title: { $regex: searchKey, $options: "i" },
        userMail: { $ne: userMail }
    }
    try {
        const allbooks = await books.find(query)
        res.status(200).json(allbooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

// get a book

exports.getABookController = async (req, res) => {
    console.log(`Get a Book Controller`);
    const { id } = (req.params)
    console.log(id);

    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)

    } catch (error) {
        res.status(200).json(error)
    }
}

// get userbook 

exports.getUserBooksController = async (req, res) => {
    console.log(`Get user Book controoler `);

    const userMail = req.payload


    try {
        const userBooks = await books.find({ userMail })
        res.status(200).json(userBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

// delete user added book


exports.deleteUserAddedBookController = async (req, res) => {
    console.log(`Inside delete a Book cotroller`);
    const { id } = req.params  // to get id

    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json(`Book deleted succesully`)

    } catch (error) {
        res.status(500).json(error)
    }

}


// purchase history /brought by


exports.getPurchasedBookController = async (req, res) => {
    console.log("Inside the purchase History Controller");

    const userMail = req.payload

    try {
        const purchasedBooks = await books.find({ boughtBy: userMail })  //backend brought by

        res.status(200).json(purchasedBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}



// -------------------ADMIN-----------------

// get all books

exports.getAllBooksAdminController = async (req, res) => {
    console.log(`Inside get all books for admin controller`);

    try {

        const allAdminBooks = await books.find()
        res.status(200).json(allAdminBooks)


    } catch (error) {
        res.status(500).json(error)

    }

}


// update book status as approved

exports.updateBookController = async (req, res) => {
    console.log(`Inside update book controller`);
    const { id } = req.params

    const updateBookData = { status: "approved" }

    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id },
            updateBookData, { new: true })
        res.status(200).json(updateBook)


    } catch (error) {
        res.status(500).json(error)


    }

}

// make payment

exports.makeBookPayamentController = async (req, res) => {
    console.log(`Inside Make Payment Controller`);
    const { _id, title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language,
        isbn, category, uploadImages,userMail
    } = req.body

    const email = req.payload
    console.log(email);
    

    try {
        console.log(`Inside Stripe`);
        
        const updateBookPayment = await books.findByIdAndUpdate({ _id }, {
            title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language,
            isbn, category, uploadImages, status: "sold", boughtBy: email,userMail
        }, { new: true })
        console.log(updateBookPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageUrl],
                    metadata: {
                        title, author, noofPages, imageUrl, price, dprice, abstract, publisher, language,
                        isbn, category, status: "sold", boughtBy: email ,userMail
                    },
                },
                unit_amount: Math.round(dprice * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            line_items,
            mode: 'payment',
            // success_url: 'http://localhost:5173/payment-success',
            // cancel_url: "http://localhost:5173/payment-error",
            success_url: 'https://book-store-frontend-mocha-three.vercel.app/payment-success',
            cancel_url: "https://book-store-frontend-mocha-three.vercel.app/payment-error",
            
            
        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        // res.status(200).json(`Success Response Received`)

    } catch (error) {
        res.status(500).json(error)
    }

}





