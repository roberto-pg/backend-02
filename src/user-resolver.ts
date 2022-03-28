import { Token } from "graphql";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Context, context } from './context';
import { User } from "./user";


@InputType()
class UserInputData {
  @Field()
  email: string

  @Field()
  password: string
}

@Resolver()
export class UserResolver {
  @Query((returns) => User, { nullable: true })
  async privateInfo(@Arg('token') token: string,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const dbToken = await ctx.prisma.tokens.findUnique({
      where: { token },
      include: { user: true }
    })
    if (!dbToken) return null

    const { user } = dbToken

    return user
  }

  @Mutation((returns) => User)
  async signUp(@Arg('data') data: UserInputData, @Ctx() ctx: Context): Promise<User>{
    await ctx.prisma.users.create({data: data})
  }

}