import { apiSlice } from "./apiSlice";
import { BACKEND_URL, ORDERS_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation({
      query: order => {
        // Extract borrowingDate from the order object
        const { borrowingDate, ...rest } = order;
    
        // Parse borrowingDate as a Date object in local time
        const borrowingDateObject = new Date(borrowingDate);
        
        // Adjust to UTC+7 (if needed, but adding 0 doesn't change the time)
        const borrowingDateInUTCPlus7 = new Date(borrowingDateObject.getTime() + 0);
    
        // Calculate previousReturnDate by adding 6 days to the adjusted borrowingDate
        const previousReturnDate = new Date(borrowingDateInUTCPlus7);
        previousReturnDate.setDate(previousReturnDate.getDate() + 6);
    
        // Calculate returnDate by adding 7 days to the adjusted borrowingDate
        const returnDate = new Date(borrowingDateInUTCPlus7);
        returnDate.setDate(returnDate.getDate() + 6);
    
        return {
          url: ORDERS_URL,
          method: "POST",
          body: {
            ...rest,
            borrowingDate: borrowingDateInUTCPlus7,
            previousReturnDate,  // previousReturnDate ที่คำนวณแล้ว
            returnDate,                        // previousReturnDate ที่คำนวณแล้ว
          },
        };
      },
    }),
    getOrderDetails: builder.query({
      query: id => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getUserOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/user-orders`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    payWithStripe: builder.mutation({
      query: orderItems => ({
        url: `${BACKEND_URL}/create-checkout-session`,
        method: "POST",
        body: orderItems,
      }),
    }),
    deliverOrder: builder.mutation({
      query: orderId => ({
        url: `${ORDERS_URL}/deliver/${orderId}`,
        method: "PATCH",
      }),
    }),
    updateOrderItemStatus: builder.mutation({
      query: ({ orderId, itemId, status }) => ({
        url: `${ORDERS_URL}/${orderId}/items/${itemId}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    deleteOrderItem: builder.mutation({
      query: ({ orderId, itemId }) => ({
        url: `${ORDERS_URL}/${orderId}/items/${itemId}`,
        method: "DELETE",
      }),
    }),

  }),
});


export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetUserOrdersQuery,
  usePayWithStripeMutation,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUpdateOrderItemStatusMutation,
  useDeleteOrderItemMutation, // Export mutation สำหรับการลบ
} = orderApiSlice;