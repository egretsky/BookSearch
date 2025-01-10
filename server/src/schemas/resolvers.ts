import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    savedBooks: Array<any>;
    bookCount: number;
}

interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface AddBookArgs {
    input: {
        bookId: string;
        authors: string;
        description: string;
        title: string;
        image: string;
        link: string;   
    }
}

interface RemoveBookArgs {
    bookId: string;
}

interface Context {
    user: User;
}

const resolvers = {
    Query: {
        me: async (_parent: unknown, _args: unknown, context: Context): Promise<User|null> => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, {input}: AddUserArgs): Promise<{token: string; user: User}> => {
            const user = await User.create({ ...input });

            const token = signToken(user.username, user.email, user._id);

            return { token, user: user as User };
        },

        loginUser: async (_parent: any, { email, password }: LoginUserArgs): Promise<{ token: string; user: User }> => {
            const user = await User.findOne({ email});

            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }

            const token = signToken(user.username, user.email, user.id);

            return { token, user: user as User };
        },

        saveBook: async (_parent: any, { input }: {input: AddBookArgs}, context: Context): Promise<User | null> => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {
                        $addToSet: {
                            savedBooks: input,
                        },
                        $inc: {bookCount: 1},
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

                return updatedUser as User;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: Context): Promise<User | null> => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {
                        $pull: {
                            savedBooks: {bookId},
                        },
                        $inc: {bookCount: -1},
                    },
                    {
                        new: true,
                    }
                );
                return updatedUser as User;
            }
            throw new AuthenticationError('Not authenticated');
        },
    },
};

export default resolvers;