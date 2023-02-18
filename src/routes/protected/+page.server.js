/** @type {import('./$types').Actions} */
export const actions = {
	sendMessage: async ({ request, locals }) => {
		const { message } = Object.fromEntries(await request.formData());

		const channel = locals.sb.channel('room1');
		channel.subscribe((status) => {
			if (status === 'SUBSCRIBED') {
				console.log('subscribed');
			}
		});

		channel.send({
			type: 'broadcast',
			event: 'message',
			payload: { message }
		});

		return {
			status: 200
		};
	}
};
