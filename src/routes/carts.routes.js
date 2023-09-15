import { Router } from 'express'
import CartModel from '../models/carts.models.js'

const cartRouter = Router()

// Route to get all the carts
cartRouter.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const foundCarts = await CartModel.find().limit(limit)

    res.status(200).send({ result: 'OK', message: foundCarts })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the carts: ${error}` })
  }
})

// Route to get a specif cart by ID
cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const foundCart = await CartModel.findById(cid)

    if (foundCart)
      res.status(200).send({ result: 'OK', message: foundCart })
    else
      res.status(404).send({ result: 'Cart Not Found', message: foundCart })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the cart: ${error}` })
  }
})

// Route to add a product into a cart
cartRouter.put('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	try {
		const cart = await CartModel.findById(cid);
		const product = await productModel.findById(pid);

		if (!product) {
			res.status(404).send({ resultado: 'Product Not Found', message: product });
			return false;
		}

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			productExists
				? productExists.quantity++
				: cart.products.push({ id_prod: product._id, quantity: 1 });
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar producto: ${error}` });
	}
});

// Route to update a cart
cartRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { id_prod, quantity } = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ result: 'Cart Not Found' });
    }

    // Actualizar el producto en el carrito
    const productIndex = cart.products.findIndex((product) => product.id_prod === id_prod);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.status(200).send({ result: 'OK', message: cart });
    } 
    else {
      res.status(404).send({ result: 'Product Not Found in Cart' });
    }
  } catch (error) {
    res.status(400).send({ error: `Error updating the cart: ${error}` });
  }
});

// Route to delete a cart
cartRouter.delete('/:cid', async (req, res) => {
  const { cid } = req.params

  try {
    const deletedCart = await CartModel.findByIdAndDelete(cid)

    if (deletedCart)
      res.status(200).send({ result: "OK", message: deletedCart })
    else
      res.status(404).send({ result: "Cart Not Found", message: deletedCart })
  }

  catch (error) {
    res.status(400).send({ error: `Error deleting the cart: ${error}` })
  }
})

export default cartRouter