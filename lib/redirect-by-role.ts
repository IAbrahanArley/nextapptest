export function redirectByRole(userType: "store_owner" | "customer") {
  return userType === "store_owner" ? "/dashboard-loja" : "/cliente";
}
