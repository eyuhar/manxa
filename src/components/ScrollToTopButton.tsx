import { useEffect, useState, type JSX } from 'react';
import { Button } from './ui/button';

function ScrollToTopButton({className}: {className?: string}): JSX.Element {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Button visibility based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return isVisible ? (
        <Button variant="outline" onClick={scrollToTop} className={"cursor-pointer " + className}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <title>arrow-up-bold</title>
                <path d="M15,20H9V12H4.16L12,4.16L19.84,12H15V20Z" />
            </svg>
        </Button>
    ) : <></>;
};

export default ScrollToTopButton;
