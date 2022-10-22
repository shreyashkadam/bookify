const router = require("express").Router();

const series = require("../models/series");

router.post("/save", async (req, res) => {
    const newSeries = series({
        name: req.body.name,
        imageURL: req.body.imageURL,
    });
    try {
        const savedSeries = await newSeries.save();
        res.status(200).send({ series: savedSeries });
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
});

router.get("/getOne/:getOne", async (req, res) => {
    const filter = { _id: req.params.getOne };
  
    const cursor = await series.findOne(filter);
  
    if (cursor) {
      res.status(200).send({ success: true, data: cursor });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  });


  router.get("/getAll", async (req, res) => {
    const options = {
      // sort returned documents in ascending order
      sort: { createdAt: 1 },
      // Include only the following
      // projection : {}
    };
  
    const cursor = await series.find(options);
    if (cursor) {
      res.status(200).send({ success: true, data: cursor });
    } else {
      res.status(200).send({ success: true, msg: "No Data Found" });
    }
  });

  router.delete("/delete/:deleteId", async (req, res) => {
    const filter = { _id: req.params.deleteId };
  
    const result = await series.deleteOne(filter);
    if (result.deletedCount === 1) {
      res.status(200).send({ success: true, msg: "Data Deleted" });
    } else {
      res.status(200).send({ success: false, msg: "Data Not Found" });
    }
  });

  router.put("/update/:updateId", async (req, res) => {
    const filter = { _id: req.params.updateId };
    const options = {
      upsert: true,
      new: true,
    };
    try {
      const result = await series.findOneAndUpdate(
        filter,
        {
          name: req.body.name,
        },
        options
      );
      res.status(200).send({ series: result });
    } catch (error) {
      res.status(400).send({ success: false, msg: error });
    }
  });

module.exports = router;