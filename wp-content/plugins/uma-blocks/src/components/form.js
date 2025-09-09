export default function Form() {
	return (
		<div className="flex flex-col gap-6 w-[300px] max-w-full justify-center">
			<div className="form-field">
				<label htmlFor="name">Full Name</label>
				<input type="text" name="name" placeholder="Full Name" required="" disabled={true} />
			</div>
			<div className="form-field">
				<label htmlFor="email">Email Address</label>
				<input type="email" name="email" placeholder="Email Address" required="" disabled={true} />
			</div>
			<div className="form-field">
				<label htmlFor="phone">Phone Number</label>
				<input type="tel" name="phone" placeholder="Phone Number" required="" disabled={true} />
			</div>
			<button
				type="submit"
				disabled={true}
				className="inline-flex items-center justify-center px-3 py-2.5 bg-[#28C76F] text-black appearance-none border-0 rounded-lg text-lg"
			>
				Claim my FREE Trial
			</button>
		</div>
	);
}
