import Swal from "sweetalert2";
// import "animate.css";

export const showAlert = (message, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: type, // success | error | warning | info
    title: message,
  });
};

export const showConfirmationDialog = async (title, description, type) => {
  return Swal.fire({
    title: title,
    text: description,
    icon: type,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#82b440",
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    }
    return false;
  });
};
