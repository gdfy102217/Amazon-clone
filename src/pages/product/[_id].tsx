import Image from "next/image";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {BeatLoader} from "react-spinners";
import BreadCrumb from "@/components/ProductPage/BreadCrumb";
import Reviews from "@/components/ProductPage/reviews/Reviews";
import InfosShipping from "@/components/ProductPage/InfosShipping";
import Infos from "@/components/ProductPage/Infos";

const DynamicPage = () => {
  const [product, setProduct] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const dummyReviews = [
    {
      rating: 3,
      likes: {
        likes: 5
      },
      reviewBy: {
        name: "Sam",
        image: product.image
      },
      review: "The pot has the perfect weight without feeling \"tinny\" and is so much lighter than my Staub Cocotte\n" +
        "I needed this size for cooking pasta for 3\n" +
        "Yes the lid is not tight-fitting but the handle is heavy so I can expect a decent seal anyway\n" +
        "Very happy with it 😊\n",
    },
    {
      rating: 5,
      likes: {
        likes: 3
      },
      reviewBy: {
        name: "Jack",
        image: "https://images-na.ssl-images-amazon.com/images/S/amazon-avatars-global/c6456f02-dc27-4bfc-b8a2-92c838c117e3._CR46,0,183,183_SX48_.jpg"
      },
      review: "If you don't want to drop hundreds on a pair of headphones while still getting the features of a quality item, I would recommend these. If you care about noise cancellation and noise insulation (others not being able to hear what you're listening to) these aren't for you. But if you don't mind those things everything else is perfect.\n" +
        "\n" +
        "Notably my favorite part about these is the battery life. I've left them on for days and the battery only goes down like 25% max. The battery lasted me two weeks after the first charge when I bought them! Super good battery life. Also, the exterior design is minimalistic and fashionable. There's room to decorate with stickers if you wanna get creative with the design too. I even kind of like that these aren't noise cancelation headphones because I wear them in public spaces where I need to be aware of my surroundings, like the gym, so they're good for that.",
    }]
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    const updatedReviews = dummyReviews.map(review => ({
      ...review,
      reviewBy: {
        ...review.reviewBy,
        image: router.query.image // Update reviewBy.image
      }
    }));

    const updatedProduct = {
      ...router.query,
      rating: 4, // Update the rating
      reviews: updatedReviews, // Assign dummy reviews
      quantity: 10,
      numberReviews: "32",
      brand: "Brand Headphone",
      sizes: [{size: "1"}, {size: "2"}],
      colors: [{color: "black", }, {color: "red"}],
      details: [
        {name: "Material", value: "Stainless Steel"},
        {name: "Finish type", value: "Uncoated"},
        {name: "Brand", value: "ZWILLING"},
        {name: "Colour", value: "Silver"},
        {name: "Capacity", value: "6 Liters"},
        {name: "Product dimensions", value: "25.3D x 32W x 18.5H centimetres"},
        {name: "Item weight", value: "1.8 Kilograms"},
        {name: "Is oven safe", value: "Yes"}
      ],
      questions: [
        {question: "What type of connectivity do these headphones offer?", answer: "These headphones offer both Bluetooth and wired connectivity."},
        {question: "Are the headphones noise-cancelling?", answer: "Yes, these headphones feature active noise cancellation technology."},
        {question: "What is the battery life of the headphones?", answer: "The headphones have a battery life of up to 20 hours on a single charge."},
        {question: "Can the headphones be used for making phone calls?", answer: "Yes, the headphones come equipped with a built-in microphone for phone calls and voice commands."},
        {question: "Do these headphones come with a warranty?", answer: "Yes, these headphones come with a one-year manufacturer warranty."},
        {question: "Are the headphones water-resistant?", answer: "Yes, the headphones are water-resistant, making them suitable for exercise and light rain."},
        {question: "What colors are available for these headphones?", answer: "The headphones are available in black, white, and blue."},
        {question: "Do the headphones support fast charging?", answer: "Yes, these headphones support fast charging, providing 2 hours of playback with just 5 minutes of charging."},
        {question: "Is there an app associated with the headphones for customization?", answer: "Yes, there is a companion app available that allows you to customize sound profiles and update firmware."},
        {question: "What accessories come with the headphones?", answer: "The headphones come with a carrying case, charging cable, and audio cable for wired use."}
      ]

    };
    setProduct(updatedProduct);
  }, [router.query]);


  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-10">
      <BreadCrumb category={product.category}/>
      {isLoading ? (
        <div className="w-full flex flex-col gap-6 items-center justify-center py-20">
          <p>Your product is loading...</p>
          <BeatLoader color="#131921" size={40}/>
        </div>
      ) : (
        <>
          <div className="w-full grid md:grid-cols-3 gap-3 bg-gray-100 rounded-lg">

            <div className="flex items-center justify-center bg-gray-200 rounded-lg relative group overflow-hidden">
              <Image
                src={product.image}
                alt="product image"
                width={500}
                height={500}
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-3 justify-center p-4">
              <Infos product={product} />
              <InfosShipping product={product}/>
            </div>

          </div>

          <Reviews product={product}/>
        </>
      )}

    </div>
  );
};

export default DynamicPage;
