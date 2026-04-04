interface TestCardProps {
  name: string;
  image: string;
  test: string;
}

const TestCard = ({ name, image, test }: TestCardProps) => {
  return (
    <div className="flex flex-col items-center justify-between text-center bg-card rounded-3xl p-6 max-w-sm sm:max-w-md lg:max-w-lg mx-auto w-full border border-primary/20">
      <div className="flex items-center gap-2 mb-4 sm:mb-5 w-full justify-center">
        <div className="flex items-center gap-x-6">
          <img
            className="object-cover size-8 rounded-full ring ring-gray-300 dark:ring-gray-600"
            src={image}
            alt={name}
          />
        </div>
        <p className="text-card-foreground text-base font-medium tracking-wide capitalize transition-colors duration-300 group-hover:text-blue-400">
          {name}
        </p>
      </div>

      <div className="relative text-card-foreground text-sm leading-relaxed bg-muted border border-white/10 p-4 rounded-2xl w-full">
        <span className="absolute -top-2 -left-2 text-primary text-4xl font-bold opacity-20">"</span>
        <p>{test}</p>
        <span className="absolute -bottom-2 -right-2 text-primary text-4xl font-bold opacity-20">"</span>
      </div>

      <div className="mt-6 h-1 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
    </div>
  );
};

export default TestCard;