const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const conn = require("../db/db");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: value => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 7
    },
    isAdmin: {
      type: Boolean,
      required: false,
      defalut: false
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userSchema.pre("save", async function(next) {
  // Hash the password before saving the user model
  const user = this;
  console.log(this);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.

  const user = await User.findOne({ email });

  if (!user) {
    throw { error: "Invalid login credentials" };
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw { error: "Invalid login credentials" };
  }
  return user;
};

userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { error: "Invalid emai" };
  }

  return user;
};

const User = conn.model("User", userSchema);

module.exports = User;
