import { Await } from '@remix-run/react';
import { Suspense, useState } from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { CartMain } from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: boolean;
  showCart: () => void;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn
}: LayoutProps) {
  const [show, setShow] = useState(false);
  const showCart = () => {
    setShow(!show);
  }
  return (
    <>
      <CartAside cart={cart} />
      {show && <SearchAside showCart={showCart} />}
      <MobileMenuAside menu={header.menu} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} showCart={showCart} />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} />}
        </Await>
      </Suspense>
    </>
  );
}

function CartAside({ cart }: { cart: LayoutProps['cart'] }) {
  return (
    <Aside id="cart-aside" heading="SHOPPING BAG" classStyle='cart-heading-styles'>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside({ showCart }: { showCart: () => void }) {
  return (
    <div id="search-aside" className="searchOverlay">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({ fetchResults, inputRef }) => (
            <div className="searchBlock">
              <input
                className="searchInput"
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <img className="closeIcon" onClick={showCart} />
            </div>
          )}
        </PredictiveSearchForm>
      </div>
      <PredictiveSearchResults />
    </div>
  );
}

function MobileMenuAside({ menu }: { menu: HeaderQuery['menu'] }) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} viewport="mobile" />
    </Aside>
  );
}
