import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CartIcon() {
  const { count } = useSelector((state) => state.cart);

  return (
    <Link
      to="/cart"
      className="relative text-gray-600 hover:text-primary transition-colors"
      title="Giỏ hàng"
    >
      <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-1 animate-fade-in">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
