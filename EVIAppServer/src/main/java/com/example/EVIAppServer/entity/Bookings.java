package com.example.EVIAppServer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "Bookings")
public class Bookings {
    public static final String STATUS_TEMPORARY = "TEMPORARY";
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_CONFIRMED = "CONFIRMED";
    public static final String STATUS_CANCELLED = "CANCELLED";
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private int bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
	@Column(name = "status", columnDefinition = "nvarchar(1111)")
	private String status;
	
    @ManyToOne
    @JoinColumn(name = "pickup_station_id")
    private Stations pickupStation;

    @ManyToOne
    @JoinColumn(name = "dropoff_station_id")
    private Stations dropoffStation;
    
    @Column(name = "passenger_name")
    private String passengerName;

    @Column(name = "passenger_email")
    private String passengerEmail;

    @Column(name = "passenger_phone")
    private String passengerPhone;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedules schedule;

    @Column(name = "booking_date")
    private Date bookingDate;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "qr_code", unique = true)
    private String qrCode;

    @Column(name = "is_paid")
    private boolean isPaid;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<BookingDetails> bookingDetails;
    
}
