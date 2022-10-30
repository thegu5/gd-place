const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
};

export const lazyLoad = (image: HTMLImageElement, src) => {
    image.style.backgroundColor = "#00000044";
    image.style.transition = "0.1s";
    image.style.borderRadius = "5px";

    const loaded = () => {
        image.style.backgroundColor = "";
        image.style.borderRadius = "";
    };
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            image.src = src;
            if (image.complete) {
                loaded();
            } else {
                image.addEventListener("load", loaded);
            }
        }
    }, options);
    observer.observe(image);

    return {
        destroy() {
            image.removeEventListener("load", loaded);
        },
    };
};
