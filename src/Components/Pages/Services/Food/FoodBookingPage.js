/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../Shared/Loading";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../Firebase/firebase.init";
import swal from "sweetalert";

const FoodBookingPage = () => {
  const { foodId } = useParams();
  const [orderData, setOrderData] = useState({});
  const [user, loading] = useAuthState(auth);

  console.log("ox: ", orderData);

  const handleOrder = () => {
    const orderFood = {
      foodId: orderData?.foodId,
      email: user?.email,
      name: orderData?.name,
      price: orderData?.price,
      img: orderData?.img,
    };
    fetch(
      "https://hotel-app-radison-87fec3b45a39.herokuapp.com/api/v1/order-food/create-order",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderFood),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        swal({
          title: "Order Successful",
          text: "Your order is successful. Check email for confirmation!",
          icon: "success",
          button: "Ok",
        });
        // event.target.reset();
      });
  };
  useEffect(() => {
    fetch(
      `https://hotel-app-radison-87fec3b45a39.herokuapp.com/api/v1/foods/${foodId}`
    )
      .then((res) => res.json())
      .then((data) => setOrderData(data?.data));
  }, [foodId]);
  if (loading) {
    return <Loading></Loading>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
  }
  return (
    <div className="mt-4 flex justify-center">
      <div className="w-11/12 xl:w-[390px] shadow-xl p-2 flex flex-col items-center pb-4">
        <img
          className="w-full xl:w-11/12 mx-auto rounded"
          src={orderData?.img}
          alt=""
        />
        <p className="mt-2">Food ID: {orderData?.foodId}</p>
        <p className="text-xl font-bold">{orderData?.name}</p>
        <p className="my-2 font-bold">
          Price: <span className="text-red-500">{orderData?.price}TK</span>/PCS
        </p>
        <button onClick={handleOrder} className="btn  btn-success text-white">
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default FoodBookingPage;
