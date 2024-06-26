import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Header,OrderCard,ProductCard,ReviewCard} from 'components';
import {SkeletonComponent,Spinner} from 'components/ui';
import { useOnViewPort } from 'hooks/useObserver';
import './styles.scss'

import { selectProduct } from 'features/Product/productSlice/productSlice';
import { ProductThunk } from 'features/Product/productSlice/thunk';
import { selectReview } from 'features/Reviews/reviewSlice/reviewSlice';
import { ReviewThunk } from 'features/Reviews/reviewSlice/thunk';



const HomePage = () => {
	
    const {reviews,loading} = useSelector(selectReview)
	const {products:{products,total:totalItems},
	selectProducts,loading:productLoading} = useSelector(selectProduct)


	const [page,setPage] = useState(1)
	const [productBuy,setProductBuy] = useState([])

	const dispatch = useDispatch();

	const loadMoreButtonRef = useRef();
    const isIntersecting = useOnViewPort(loadMoreButtonRef)
    

	useEffect(() => {
	  dispatch(ReviewThunk())
	},[dispatch])



	useLayoutEffect(() => {
		if(page >=  Math.ceil(totalItems / 20)) return
		
             if(isIntersecting && !productLoading ){
				dispatch(ProductThunk({page:page,page_size: 20}))
				setPage(prev => prev + 1)
			 }
      // eslint-disable-next-line
	  },[dispatch,page,isIntersecting])

	  
	return <div className='wrapper'>
		<div className='wrapper__container'>
			<Header/>
			<div className='review-cards'>
				{loading ? (
						Array.from({ length: 2 }).map((_, index) => (
							<SkeletonComponent key={index} styles={{ opacity: '0.7' }} className='skeleton' />
						))
					 )  

					: 

					!!reviews?.length && reviews?.map((review,index) => (
                           <ReviewCard key={index}  review={review}/>
					))
				}
			</div>
			<OrderCard selectProducts={selectProducts}/>
			<div className='product-cards'>
				{
					 !!products?.length && products?.map((product,index) =>(
						<ProductCard
							key={index}
							product={product}
							productBuy={productBuy}
							setProductBuy={setProductBuy}
							selectProducts={selectProducts}
						/>
					))
				}
			 <div ref={loadMoreButtonRef} />
			</div>
			{productLoading && <div className='loading'><Spinner/></div>}
		</div>
	</div>;
};

export default HomePage;
