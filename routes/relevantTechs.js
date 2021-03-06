
import Router from 'koa-router'
import Accounts from '../modules/accounts.js'
import TechDetails from '../modules/techniciandetails.js'

const router = new Router()
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('relevant technicians hub router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) {
		return ctx.redirect('/login?msg=you need to log in&referrer=/custhub/reportIssue/relevantTechs')
	}
	await next()
}

// async function checkType(ctx, next) {
// 	console.log('customer hub router middleware')
// 	console.log(ctx.hbs)
// 	const account = await new Accounts(dbName)
// 	const accountType = await account.getType(ctx.hbs.user)
// 	if(accountType !== 'customer') return ctx.redirect("/?msg=You don't have access to this page!")
// 	await next()
// }

router.use(checkAuth)
// router.use(checkType)

/**
 * determines which technicians can work on said appliance
 * @param {Object} ctx Koa context
 * @returns {Array} returns array of object with technician info.
 */
async function findRelevantTechnicians(ctx) {
	const td = await new TechDetails(dbName)
	const acc = await new Accounts(dbName)
	const appliance = ctx.session.item //this works
	const allTechnicians = await acc.getAccounts('technician')
	const relevantTechnicians = []
	//loop through all technicians to see if appliances are true for them, shove into array
	for(const i of allTechnicians) {
		const values = await td.getDetails(i.id)
		console.log(values)
		if(values.types[appliance] === true) relevantTechnicians.push(values)
	}
	acc.close()
	td.close()
	return relevantTechnicians
}

router.get('/custhub/reportIssue/relevantTechs', async ctx => {
	try {
		const relevantTechnicians = await findRelevantTechnicians(ctx)
		if(relevantTechnicians.length === 0) throw new Error('No relevant technicians')
		ctx.hbs.records = relevantTechnicians
		ctx.hbs.status = true
	} catch(err) {
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		ctx.hbs.status = false
	} finally {
		await ctx.render('relevantTechs', ctx.hbs) //send data to website
	}
})

export default router
