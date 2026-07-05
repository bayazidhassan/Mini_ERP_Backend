import { Customer } from '../customers/customer_model';
import { Product } from '../products/product_model';
import { Sale } from '../sales/sale_model';

const getDashboardStats = async () => {
  const [totalProducts, totalCustomers, totalSales, lowStockProducts] =
    await Promise.all([
      Product.countDocuments(),
      Customer.countDocuments(),
      Sale.countDocuments(),
      Product.find({ stockQuantity: { $lt: 5 } }).select(
        'name sku stockQuantity sellingPrice image',
      ),
    ]);

  return {
    totalProducts,
    totalCustomers,
    totalSales,
    lowStockProducts,
  };
};

export const dashboardService = {
  getDashboardStats,
};
