const Category = require("../models/category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.createCategory = async (req, res) => {
    try {

     
        const {name, description} = req.body;
 
        if(!name) {
            return res
                .status(404)
                .json({
                success: false,
                message: 'All fields are required'
            })
        }
         let imageUrl = "";
            if (req.files && req.files.image) {
              const image = await uploadImageToCloudinary(
                req.files.image,
                process.env.FOLDER_NAME
              );
              imageUrl = image.secure_url;
            }

     
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
            image: imageUrl,
        });
        console.log(CategoryDetails);
    
        return res.status(200).json({
            success: true,
            message: 'Category Created Successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find(
            {}, 
            {name: true, description: true,image:true}
        );
        res.status(200).json({
            success: true,
            message: "All tags returned successfully",
            data: allCategories,
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.categoryPageDetails = async (req, res) => {
    try {
        //get categoryId
        const {id} = req.params;
      
        const selectedCategory = await Category.findById(id)
                                        .populate("products")
                                        .exec();

        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Data Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
            }
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}