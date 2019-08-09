export const index = () => `export default async ()=>({
  server: {
    port: process.env.PORT || 3000
  },
  eureka:{
    enabled:false
  }
});`;
