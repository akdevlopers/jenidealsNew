'use client'

import { useRouter } from "next/navigation";
import Image from "next/image";

export function HorizontalProducts({ products = [] }) {
  const router = useRouter();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="pt-4">
      <div className="px-4 mb-3">
        <h2 className="text-lg font-bold text-fg">Brands</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
        {products.slice(0, 6).map((product) => (
          <button
            key={product.id}
            onClick={() => router.push(`/product/${product.id}`)}
            className="flex-shrink-0 w-36 relative overflow-hidden rounded-lg border border-line bg-surface active:opacity-80"
            style={{ boxShadow: "var(--shadow-xs)" }}
          >
            <div className="aspect-square bg-surface-2">
              <Image
                src={product.product_img_url}
                alt={product.product_name}
                width={144}
                height={144}
                className="h-full w-full object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
