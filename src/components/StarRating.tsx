

type StarRatingProps = {
    rating: number; // e.g. 3.6
    outOf?: number; // deafult: 5
}

export default function StarRating({ rating, outOf = 5 }: StarRatingProps) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = outOf - fullStars - halfStar;

    return (
        <div className="flex items-center w-20">
            {Array.from({ length: fullStars }, (_, index) => (
                <svg
                    key={"star"+index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="fill-yellow-500"
                >
                    <title>star</title>
                    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                </svg>
            ))}
            {halfStar > 0 && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="fill-yellow-500"
                >
                    <title>star-half-full</title>
                    <path d="M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
                </svg>
            )}
            {Array.from({ length: emptyStars }, (_, index) => (
                <svg
                    key={"empty-star"+index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="fill-yellow-500"
                >
                    <title>star-outline</title>
                    <path d="M12,15.39L8.24,17.66L9.23,13.38L5.91,10.5L10.29,10.13L12,6.09L13.71,10.13L18.09,10.5L14.77,13.38L15.76,17.66M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" />
                </svg>
            ))}
        </div>
    );
}