import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart, Telescope } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/formatPrice'
import { getImageUrl } from '@/utils/getImageUrl'
import { getDiscount } from '@/utils/getDiscount'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { cn } from '@/utils/cn'
import ProductPlaceholder from '@/components/ui/ProductPlaceholder'

// Режим клика: 'double' — 1-й клик активирует, 2-й переходит
//             'button' — клик только активирует, переход через кнопку "View"
const CLICK_MODE: 'double' | 'button' = 'button'

// Размеры контейнера веера (фиксированные — масштабируется снаружи)
const FAN_WIDTH = 640
const FAN_HEIGHT = 460

// Размер карточки
const CARD_WIDTH = 240
const CARD_HEIGHT = 340

// Позиции карточек в веере
// x — сдвиг по горизонтали, y — по вертикали, rotate — наклон

const FAN_POSITIONS = [
  { x: -90, y: -8, rotate: -18 },
  { x: -30, y: -14, rotate: -6 },
  { x: 45, y: -8, rotate: 6 },
  { x: 110, y: 12, rotate: 18 },
];

// Смещение активной карточки
const ACTIVE_TRANSFORM = {
  y: -50,
  scale: 1.08,
}

interface Props {
  products: Product[]
}

export default function ProductFan({ products }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const addItem = useCartStore((s) => s.addItem)
  const toggleFav = useFavoritesStore((s) => s.toggle)

  if (products.length === 0) return null

  const items = products.slice(0, 4)

  return (
    <div
      className="relative scale-[0.55] sm:scale-75 lg:scale-100" 
      style={{ width: FAN_WIDTH, height: FAN_HEIGHT }}
    >
      {items.map((product, i) => {
        const pos = FAN_POSITIONS[i]
        const isActive = activeIndex === i
        const isOtherActive = activeIndex !== null && !isActive

        const primaryColor = product.colors[0]
        const imageUrl = getImageUrl(product.slug, primaryColor?.slug)
        const discount = getDiscount(product.price, product.old_price)

        // финальные transform и z-index
        const transform = isActive
          ? `translate(0, ${ACTIVE_TRANSFORM.y}px) rotate(0deg) scale(${ACTIVE_TRANSFORM.scale})`
          : `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotate}deg) scale(${isOtherActive ? 0.92 : 1})`

        const zIndex = isActive ? 30 : 10 + i

        const handleCardClick = () => {
          if (CLICK_MODE === 'double' && isActive) {
            window.location.href = `/product/${product.id}`
            return
          }
          setActiveIndex(isActive ? null : i)
        }

        const handleAddToCart = () => {
          if (!primaryColor) return
          addItem({
            productId: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: imageUrl,
            color: primaryColor,
            size: String(40),
            quantity: 1,
          })
        }

        return (
          <div
            key={product.id}
            onClick={handleCardClick}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              marginLeft: -CARD_WIDTH / 2,
              marginTop: -CARD_HEIGHT / 2,
              transform,
              zIndex,
              transition:
                'transform 400ms cubic-bezier(0.4, 0, 0.2, 1), z-index 0ms',
            }}
            className={cn(
              'absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-lg',
              isOtherActive && 'opacity-100',
              isActive && 'cursor-default shadow-2xl'
            )}
          >
            {/* Картинка */}
            <div className="relative aspect-square overflow-hidden bg-bg-tertiary">
              {discount && (
                <span className="absolute left-3 top-3 z-10 rounded-full bg-error px-2 py-0.5 text-[10px] font-bold text-white">
                  −{discount}%
                </span>
              )}

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductPlaceholder
                  colors={product.colors}
                  name={product.name}
                  className="h-full w-full"
                />
              )}

              {/* Оверлей с действиями — только на активной карточке */}
              {isActive && (
                <div className="absolute inset-0 flex items-start justify-center gap-2 bg-gradient-to-b from-black/20 via-transparent to-transparent pt-8">
                  {CLICK_MODE === 'button' && (
                    <Link
                      to={`/product/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
                      aria-label="View product"
                    >
                      <Telescope size={16} />
                    </Link>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToCart()
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
                    aria-label="Add to cart"
                  >
                    <ShoppingBag size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFav(product.id)
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
                    aria-label="Toggle favorite"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Информация */}
            <div className="flex flex-col gap-1 p-4">
              <p className="text-xs uppercase tracking-wide text-text-tertiary">
                {product.brand}
              </p>
              <h3 className="line-clamp-2 text-sm font-medium text-text">
                {product.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-semibold text-text">
                  {formatPrice(product.price)}
                </span>
                {product.old_price && (
                  <span className="text-xs text-text-tertiary line-through">
                    {formatPrice(product.old_price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

