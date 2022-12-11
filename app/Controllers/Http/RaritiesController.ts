import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rarity from 'App/Models/Rarity'
import { schema } from '@ioc:Adonis/Core/Validator'
// import Query from 'adonis-search'
export default class RaritiesController {
  public async index() {
    const rarities = await Rarity.query()
    const raritiesSerialized = rarities.map((rarity) => rarity.serialize())
    return raritiesSerialized
  }

  public async search({ request }: HttpContextContract) {
    const searchSchema = schema.create({
      search_term: schema.string(),
    })
    const payload = await request.validate({ schema: searchSchema })
    const term = payload.search_term
    const rarities = await Rarity.query()
      .where('name', 'like', `%${term}%`)
      .orWhere('description', 'like', `%${term}%`)
    const raritiesSerialized = rarities.map((rarity) => rarity.serialize())
    return raritiesSerialized
  }

  public async store({ request }: HttpContextContract) {
    const newRaritySchema = schema.create({
      name: schema.string(),
      description: schema.string(),
      // TODO: validate this as hexadecimal
      color_code: schema.string(),
    })

    const payload = await request.validate({ schema: newRaritySchema })
    const rarity = new Rarity()
    rarity.name = payload.name
    rarity.description = payload.description
    rarity.color_code = payload.color_code
    if (await rarity.save()) {
      return rarity
    }
  }

  public async destroy({ params }: HttpContextContract) {
    await Rarity.query().where('id', params.id).delete()
  }

  // public async show({ params }: HttpContextContract) {
  //   try {
  //     const rarity = await Rarity.find(params.id)
  //     if (rarity) {
  //       return rarity
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  //
  // public async update({ request, params }: HttpContextContract) {
  //   const rarity = await Rarity.find(params.id)
  //   if (rarity) {
  //     rarity.name = request.input('name')
  //     rarity.description = request.input('description')
  //     rarity.color_code = request.input('color_code')
  //     if (await rarity.save()) {
  //       return rarity
  //     }
  //     return // 422
  //   }
  //   return // 401
  // }
}
