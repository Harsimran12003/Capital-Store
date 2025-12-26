import express from "express";
import Order from "../models/orderModel.js";

const router = express.Router();

router.post("/webhook", async(req,res)=>{
  try {
    const { awb, current_status } = req.body;

    const order = await Order.findOne({ "shipment.awb": awb });

    if(order){
      order.shipment.status = current_status;
      await order.save();
    }

    res.sendStatus(200);
  } catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

export default router;
