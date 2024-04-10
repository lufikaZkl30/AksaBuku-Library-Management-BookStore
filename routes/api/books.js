const {Router} = require('express')
const router = Router();
const Books = require('../../models/books');

//GET
router.get('/', async (req,res) => {
  try {
    const items = await Books.find(); //selesaikan dulu findnya
    res.status(200).json(items) 
  } catch (error){
    res.status(500).json({message: error.message})
  }
})

//POST
router.post('/', async(req,res) => {
	try {
		const newBooks = new Books(req.body)
		const savedBooks = await newBooks.save()
		if(!savedBooks) {
			res.status(500).json({message: 'Internal server error'})
		}
		res.status(200).json(savedBooks)
	} catch (error){
		res.status(500).json({message: error.message})
	}
})
	
//PUT
router.put('/:id', async(req,res) => {
  try {
    const updatedBooks = await Books.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!updatedBooks){
      res.status(404).json({message: 'Not found'})
    }
    res.status(200).json(updatedBooks)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

//DELETE
router.put('/:id', async(req,res) => {
  try {
    const deletedBooks = await Books.findByIdAndDelete(req.params.id)
    if(!deletedBooks){
      res.status(404).json({message: 'Not found'})
    }
    res.status(200).json('Deleted sucessfully')
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})


  module.exports = router
